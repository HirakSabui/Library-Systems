"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useLibrary } from "@/contexts/LibraryContext"
import { useToast } from "@/hooks/use-toast"
import { Search, Users, Mail, Calendar, BookOpen, Plus, Trash2 } from "lucide-react"
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog"

export function MembersManagement() {
  const { members, deleteMember } = useLibrary()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null)

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDeleteMember = async (id: string) => {
    try {
      await deleteMember(id)
      toast({
        title: "Member deleted",
        description: "The member has been successfully removed from the library.",
      })
    } catch (error: any) {
      console.error("Error deleting member:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete the member. Please try again.",
        variant: "destructive",
      })
    }
    setDeleteDialogOpen(false)
    setMemberToDelete(null)
  }

  const openDeleteDialog = (memberId: string) => {
    setMemberToDelete(memberId)
    setDeleteDialogOpen(true)
  }

  const getMemberToDeleteName = () => {
    if (!memberToDelete) return ""
    const member = members.find((m) => m.id === memberToDelete)
    return member ? member.name : ""
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Members Management</h1>
          <p className="text-gray-600">Manage library members and their information ({members.length} members)</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Member
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search members by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Members List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {member.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => openDeleteDialog(member.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Joined {member.joinedAt.toDate().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-gray-500" />
                  <span>Books checked out:</span>
                </div>
                <Badge variant={member.booksCheckedOut > 0 ? "default" : "secondary"}>{member.booksCheckedOut}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge
                  variant={member.isActive ? "default" : "secondary"}
                  className={member.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                >
                  {member.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery ? "Try adjusting your search query" : "No members have been registered yet"}
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Member
            </Button>
          </CardContent>
        </Card>
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => memberToDelete && handleDeleteMember(memberToDelete)}
        title="Delete Member"
        description={`Are you sure you want to delete "${getMemberToDeleteName()}"? This action cannot be undone.`}
      />
    </div>
  )
}
